function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="mg-empty-state">
      {Icon && <Icon size={38} />}

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

export default EmptyState;