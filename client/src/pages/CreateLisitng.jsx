
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
  
      const formDataUpload = new FormData();
      Array.from(files).forEach((file) => formDataUpload.append('images', file));
  
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
  
        const data = await res.json();
        console.log('Backend Response:', data);
  
        if (!res.ok) {
          throw new Error(data.message || 'Image upload failed');
        }
  
        if (Array.isArray(data.imageUrls)) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...data.imageUrls],
          }));
        } else {
          throw new Error('Invalid response format: data.imageUrls should be an array');
        }
        
      } catch (err) {
        console.error('Image upload error:', err.message);
        setImageUploadError(err.message);
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };
  

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError('Upload at least one image');
    if (+formData.regularPrice < +formData.discountPrice)
      return setError('Discount price must be lower than regular price');
    setLoading(true);

    const listing = {
      ...formData,
      userRef: currentUser?._id || 'guest',
      createdAt: new Date().toISOString(),
    };
    const listings = JSON.parse(localStorage.getItem('listings')) || [];
    const newListing = { ...listing, _id: Date.now().toString() };
    localStorage.setItem('listings', JSON.stringify([...listings, newListing]));

    setLoading(false);
    navigate(`/listing/${newListing._id}`);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder="Name" id="name" value={formData.name} onChange={handleChange} required className="border p-3 rounded-lg" />
          <textarea placeholder="Description" id="description" value={formData.description} onChange={handleChange} required className="border p-3 rounded-lg" />
          <input type="text" placeholder="Address" id="address" value={formData.address} onChange={handleChange} required className="border p-3 rounded-lg" />

          <div className="flex gap-6 flex-wrap">
            {['sale', 'rent'].map((option) => (
              <label key={option} className="flex gap-2">
                <input type="checkbox" id={option} onChange={handleChange} checked={formData.type === option} className="w-5" />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
            {['parking', 'furnished', 'offer'].map((key) => (
              <label key={key} className="flex gap-2">
                <input type="checkbox" id={key} onChange={handleChange} checked={formData[key]} className="w-5" />
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" value={formData.bedrooms} onChange={handleChange} className="p-3 border rounded-lg" />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" value={formData.bathrooms} onChange={handleChange} className="p-3 border rounded-lg" />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" value={formData.regularPrice} onChange={handleChange} className="p-3 border rounded-lg" />
              <div>
                <p>Regular price</p>
                {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input type="number" id="discountPrice" value={formData.discountPrice} onChange={handleChange} className="p-3 border rounded-lg" />
                <div>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border rounded w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
          {formData.imageUrls.map((url, i) => (
            <div key={i} className="flex justify-between p-3 border items-center">
              <img src={url} alt='listing' className="w-20 h-20 object-contain rounded-lg" />
              <button onClick={() => handleRemoveImage(i)} className="text-red-700 uppercase">Delete</button>
            </div>
          ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
