import React, { useState } from "react";
import User_icon from "../assets/images/user_icon.png";
import Phone_icon from "../assets/images/phone_icon.png";
import Pass_icon from "../assets/images/password_icon.png";
import "../component/Signup.css";
import app from "../firebaseconfig";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateField = (field, value) => {
    let newErrors = { ...errors };

    if (field === "name" && action === "Sign Up") {
      if (!value.trim()) {
        newErrors.name = "Name is required.";
      } else {
        delete newErrors.name;
      }
    }

    if (field === "phone") {
      if (!value.trim()) {
        newErrors.phone = "Phone number is required.";
      } else if (!/^\d{10}$/.test(value)) {
        newErrors.phone = "Phone number must be 10 digits.";
      } else {
        delete newErrors.phone;
      }
    }

    if (field === "password") {
      if (!value) {
        newErrors.password = "Password is required.";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    validateField("name", newValue);
  };

  const handlePhoneChange = (event) => {
    const newValue = event.target.value;
    setPhone(newValue);
    validateField("phone", newValue);
  };

  const handlePasswordChange = (event) => {
    const newValue = event.target.value;
    setPassword(newValue);
    validateField("password", newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateField("name", name);
    validateField("phone", phone);
    validateField("password", password);

    if (Object.keys(errors).length === 0) {
      const db = getFirestore(app);
      if (action === "Sign Up") {
        try {
          const docRef = await addDoc(collection(db, "users"), {
            name: name,
            phone: phone,
            password: password,
          });
          console.log("Form is valid! User signed up successfully with doc ID:", docRef.id);
          // Here you can use docRef.id as needed
          localStorage.setItem("userId", docRef.id);
          console.log(docRef.id);  // Example of storing the document ID in localStorage
          setName("");
          setPhone("");
          setPassword("");
          navigate("/"); // Redirect to home after signup
        } catch (error) {
          console.error("Error signing up:", error);
        }
      }
       else if (action === "Login") {
        try {
          const usersQuery = query(
            collection(db, "users"),
            where("phone", "==", phone),
            where("password", "==", password)
          );
          const querySnapshot = await getDocs(usersQuery);

          if (querySnapshot.empty) {
            console.log("No matching user found");
          } else {
            console.log("User logged in successfully");

            if (phone === "9054214277" && password === "@Aniket_007") {
              localStorage.setItem("phone", "9054214277");
              localStorage.setItem("name", "Aniket Solanki");
              navigate("/home");
            } else if (phone !== "" && password !== "") {
              let myName = "";
              let myPhone = "";
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                myName = data.name;
                myPhone = data.phone;
              });
              localStorage.setItem("phone", myPhone);
              localStorage.setItem("name", myName);
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      }
    } else {
      console.log("Form has errors:", errors);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="containe">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="inputs">
          {action === "Sign Up" && (
            <div className="input">
              <img src={User_icon} alt="User icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
          )}
          <div className="input">
            <img src={Phone_icon} alt="Phone icon" />
            <input
              type="text"
              placeholder="Phone no."
              value={phone}
              onChange={handlePhoneChange}
            />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </div>
          <div className="input">
            <img src={Pass_icon} alt="Password icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
        </div>
        {action === "Login" && (
          <div className="forgo-pass">
            Lost Password?<span>Click Here!</span>
          </div>
        )}
        <div className="submit">
          <button
            className={action === "Login" ? "sub gray" : "sub"}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign Up
          </button>
          <button
            className={action === "Sign Up" ? "sub gray" : "sub"}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </button>
        </div>
        <div className="submit1">
          <button className="sub1" type="submit">
            Submit
          </button>
          <div className="error-messages">
            {Object.values(errors).map((error, index) => (
              <div key={index} className="error">
                {error}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
