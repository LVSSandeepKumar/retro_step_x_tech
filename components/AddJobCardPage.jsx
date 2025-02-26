import React from 'react';

const AddJobCardPage = ({ onSave, onCancel }) => {
  const handleSave = () => {
    // Implement save logic here
    onSave();
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Job Card</h2>
      {/* Add form fields here */}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button onClick={handleSave} className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default AddJobCardPage;
