import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // Start with empty name
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail); // Set email

      // Fetch profile data from backend
      axios
        .get(`http://localhost:5000/get-profile?email=${storedEmail}`)
        .then((res) => {
          // If the response contains the name and phone
          if (res.data.name) {
            setName(res.data.name); // Set the name from the backend
          }
          if (res.data.phone) {
            setPhone(res.data.phone); // Set phone number from backend
          }
          if (res.data.profile_url) {
            setPreview(res.data.profile_url); // Set profile image URL from backend
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching profile:", err);
        });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      alert("📱 Phone number is required!");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);
    if (profilePic) formData.append("profile", profilePic);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.profile_url) {
        setPreview(res.data.profile_url); // Update preview after saving
      }

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Profile update failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Your Profile</h2>

      <div className="text-center mb-6">
        <p className="text-gray-700"><strong>Name:</strong> {name || "Loading..."}</p>
        <p className="text-gray-700"><strong>Email:</strong> {email}</p>
      </div>

      {preview && (
        <div className="flex justify-center mb-6">
          <img
            src={preview}
            alt="Profile"
            className="w-28 h-28 object-cover rounded-full border-4 border-blue-300 shadow-md"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-1">Upload New Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
