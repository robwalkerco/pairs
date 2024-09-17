export default function Footer() {
  return (
    <div className="text-white flex flex-col items-center space-y-2">
      <div className="font-medium">
        Built by{" "}
        <a href="https://github.com/robwalkerco" target="_blank">
          Rob Walker
        </a>{" "}
        and{" "}
        <a href="https://github.com/dtaylorbrown" target="_blank">
          Daniella Taylor-Brown
        </a>
      </div>
      <div>
        <a
          className="underline"
          href="https://docs.partykit.io"
          target="_blank"
        >
          View code in GitHub
        </a>
      </div>
    </div>
  );
}
