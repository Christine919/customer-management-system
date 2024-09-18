import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

const CDNURL = "https://kqjwsihcwmhroknelgro.supabase.co/storage/v1/object/public/images/";

function ImageUpload({ onImageUpload, reset }) {
  const [previewImages, setPreviewImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  
  async function uploadImage(e) {
    let file = e.target.files[0];
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(user.id + "/" + uuidv4(), file);
  
    if (data) {
      const imageUrl = CDNURL + data.path; // Get the image URL
      setPreviewImages(prevImages => [...prevImages, imageUrl]);
      onImageUpload(imageUrl);  // Pass the image URL to the parent component
      console.log(imageUrl);
      return imageUrl;  // Return the image URL for the form
    } else {
      console.log(error);
      return null;
    }
  }  

  useEffect(() => {
    if (reset) {
      setPreviewImages([]);
    }
  }, [reset]);

  return (
    <Container align="center" className="container-sm mt-4">
      {user ? (
        <>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control 
              type="file" 
              accept="image/png, image/jpeg" 
              onChange={(e) => uploadImage(e)} 
            />
          </Form.Group>

          {/* Display uploaded images */}
          <Row xs={1} md={3} className="g-4 mt-3">
            {previewImages.length > 0 ? (
              previewImages.map((imageUrl, index) => (
                <Col key={index}>
                  <Card>
                    <Card.Img variant="top" src={imageUrl} />
                    <Card.Body>
                      <Button variant="danger" onClick={() => {
                        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
                        // Optionally handle removal from storage here
                      }}>
                        Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No images to display</p>
            )}
          </Row>
        </>
      ) : (
        <p>Please log in to upload images.</p>
      )}
    </Container>
  );
}

export default ImageUpload;
