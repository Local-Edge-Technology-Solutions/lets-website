import ScrollProgress from '../ScrollProgress';

export default function ScrollProgressExample() {
  return (
    <>
      <ScrollProgress />
      <div className="h-[200vh] p-8">
        <h2 className="text-2xl">Scroll down to see the progress bar at the top</h2>
      </div>
    </>
  );
}
