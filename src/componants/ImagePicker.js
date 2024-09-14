import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage'; // Ensure this path is correct
import './ImagePicker.css'; // External CSS file
import { useAuth } from '../context/AuthContext';

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const apiKey = '2488b3b0561fa3da5739591f3691ec87'; // Replace with your actual API key
  const { setUser } = useAuth();

  useEffect(() => {
    // Update user profile with new image URL
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const profilePic = localStorage.getItem('pic');
    
    setUser({
      name,
      email,
      profilePic
    });
  }, [imageUrl]); // This effect runs when imageUrl changes
 
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageSrc(reader.result);
    }
    setModalOpen(true);
  };

  // Handle cropping area
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Crop and get image
  const showCroppedImage = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      const blob = await fetch(croppedImageUrl).then(res => res.blob());
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      setCroppedImage(file);
    } catch (e) {
      console.error(e);
    }
  };

  // Upload image to ImgBB
  const uploadImage = async () => {
    if (!croppedImage) {
      console.error('No cropped image to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', croppedImage);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.data && result.data.url) {
        setImageUrl(result.data.url);
        localStorage.setItem('pic', result.data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
      setModalOpen(false); // Close the modal after upload
    }
  };

  // Open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="image-cropper-container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            {imageSrc && (
              <>
                <div className="cropper-wrapper">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // 1 for square crop
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <button className="crop-button" onClick={showCroppedImage}>
                  Crop Image
                </button>
                {croppedImage && (
                  <>
                    <img src={URL.createObjectURL(croppedImage)} alt="Cropped" />
                    <button className="upload-button" onClick={uploadImage}>
                      Upload Image
                    </button>
                  </>
                )}
                {loading && <p>Uploading...</p>}
                {imageUrl && (
                  <div>
                    <p>Image uploaded successfully!</p>
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                      {imageUrl}
                    </a>
                  </div>
                )}
              </>
            )}
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
