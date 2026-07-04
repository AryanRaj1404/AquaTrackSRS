import "../styles/features.css";

function FeaturesSection() {
  return (
    <section id="features" className="features">

      <h2>Why Choose AquaTrack?</h2>

      <div className="feature-container">

        <div className="feature-card">
          <div className="icon">🏢</div>
          <h3>Apartment Management</h3>
          <p>
            Easily manage apartments, households and residents from one place.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">💧</div>
          <h3>Water Usage Tracking</h3>
          <p>
            Monitor water consumption and gain useful insights into usage.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">🔒</div>
          <h3>Secure Authentication</h3>
          <p>
            Protected using JWT authentication and encrypted passwords.
          </p>
        </div>

      </div>

    </section>
  );
}

export default FeaturesSection;