import { FigmaMark } from "./Icons";
import { orbitSkills } from "../data/portfolio";

export default function OrbitSystem() {
  return (
    <div className="orbit-system" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orbit orbit-four" />

      {orbitSkills.map((skill, index) => (
        <div
          key={skill}
          className={`orbit-icon tech-${index}`}
          style={{ "--angle": `${index * 36}deg` }}
        >
          {skill === "Figma" ? <FigmaMark /> : <span>{shortLabel(skill)}</span>}
        </div>
      ))}
    </div>
  );
}

function shortLabel(skill) {
  const labels = {
    JavaScript: "JS",
    "Node.js": "Node",
    Python: "Py",
    GitHub: "GH",
    "VS Code": "VS"
  };
  return labels[skill] ?? skill;
}
