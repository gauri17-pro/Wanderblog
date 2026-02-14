import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    content: "",
    author: "",
    image: ""
  });

 const API = `${window.__ENV__.API_URL}/blogs`;

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API);
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API, form);

      // Add new blog at top
      setBlogs([res.data, ...blogs]);

      // Reset form
      setForm({
        destination: "",
        content: "",
        author: "",
        image: ""
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  // ================= CLOSE MODAL WITH ESC =================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo">WanderBlog</div>
        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          Create Blog
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Explore the World Through Stories</h1>
          <p>Share your journeys with everyone</p>
        </div>
      </section>

      {/* ================= LATEST STORIES ================= */}
      <section className="blog-section">
        <h2 className="section-title">Latest Stories</h2>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <img
                src={blog.image}
                alt={blog.destination}
                className="card-image"
              />

              <div className="card-body">
                <h3 className="card-title">
                  {blog.destination}
                </h3>

                <p className="card-text">
                  {blog.content.substring(0, 130)}...
                </p>

                <div className="card-footer">
                  <span className="author">
                    ✍ {blog.author}
                  </span>
                  <button className="read-btn">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create New Blog</h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      destination: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Author Name</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      author: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Story</label>
                <textarea
                  rows="4"
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="publish-btn"
                >
                  Publish Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
