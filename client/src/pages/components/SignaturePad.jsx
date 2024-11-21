import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import supabase from "../../config/supabaseClient";

const SignaturePad = ({ order_id, onSignatureUpload }) => {
    const sigCanvas = useRef();
    const [uploading, setUploading] = useState(false);

    const clear = () => sigCanvas.current.clear();

    const save = async () => {
        if (sigCanvas.current.isEmpty()) {
            alert("Please draw a signature first!");
            return;
        }

        const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        const base64Data = dataUrl.split(",")[1];
        const blob = await fetch(`data:image/png;base64,${base64Data}`).then((res) =>
            res.blob()
        );

        try {
            setUploading(true);

            const { data, error } = await supabase.storage
                .from("signatures")
                .upload(`order-${order_id}/signature-${Date.now()}.png`, blob, {
                    contentType: "image/png",
                });

            if (error) {
                console.error("Error uploading signature:", error);
                alert("Failed to upload signature.");
            } else {
                const signatureUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/signatures/${data.path}`;

                onSignatureUpload(signatureUrl);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 mt-8">
            <h3 className="text-xl font-bold">Sign Below:</h3>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                    width: 500,
                    height: 200,
                    className: "bg-white border rounded",
                    willReadFrequently: true,
                }}
            />
            <div className="flex space-x-4">
                <button
                    onClick={clear}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Clear
                </button>
                <button
                    onClick={save}
                    disabled={uploading}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    {uploading ? "Uploading..." : "Save Signature"}
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
