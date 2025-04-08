function RequirementsList({ requirements }) {
  return (
    <ul>
      {requirements.map((req, index) => (
        <li key={index}>
          {req.toString()}
          {req.dependencies.length > 0 && (
            <ul>
              {req.dependencies.map((dep, depIndex) => (
                <li key={depIndex}>{dep.toString()}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default RequirementsList;
