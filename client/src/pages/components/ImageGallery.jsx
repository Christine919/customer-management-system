import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

const CDNURL = "https://kqjwsihcwmhroknelgro.supabase.co/storage/v1/object/public/images/";

function ImageGallery() {
  const [images, setImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function deleteImage(imageName) {
    const { error } = await supabase
      .storage
      .from('images')
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages(); // Refresh the image list after deletion
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user ? (
        <Row xs={1} md={3} className="g-4">
          {images.map((image) => (
            <Col key={CDNURL + user.id + "/" + image.name}>
              <Card>
                <Card.Img variant="top" src={CDNURL + user.id + "/" + image.name} />
                <Card.Body>
                  <Button 
                    variant="danger" 
                    onClick={() => deleteImage(image.name)}
                  >
                    Delete Image
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Please log in to view images.</p>
      )}
    </Container>
  );
}

export default ImageGallery;
