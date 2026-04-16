export default function Spinner({ size = 20 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-uwazi-pale border-t-uwazi-blue rounded-full animate-spin"
    />
  );
}