import CustomCursor from '../CustomCursor';

export default function CustomCursorExample() {
  return (
    <>
      <CustomCursor />
      <div className="p-8 space-y-4">
        <h2 className="text-2xl">Move your mouse to see the custom cursor</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Hover over me
        </button>
      </div>
    </>
  );
}
