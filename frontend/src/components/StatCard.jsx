function StatCard({ icon: Icon, title, value, description }) {
  return (
    <article className="mg-summary-card">
      <div className="mg-summary-icon">
        <Icon size={22} />
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span className="mg-table-secondary">{description}</span>
      </div>
    </article>
  );
}

export default StatCard;