import { IconStar } from "./Icons";

export function Stars({ value = 0, size = "md", onChange, interactive = false }) {
  const rounded = interactive ? value : Math.round(value);

  return (
    <div className={`stars stars-${size}${interactive ? " stars-interactive" : ""}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star ${n <= rounded ? "is-filled" : ""}`}
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
        >
          <IconStar filled={n <= rounded} />
        </button>
      ))}
    </div>
  );
}
