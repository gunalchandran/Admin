import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login"); // Redirect to login
  }, [navigate]);

  return null;
};

export default About;
