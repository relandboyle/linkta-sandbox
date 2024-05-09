import React from 'react';
import TreeVisualizationBox from './components/TreeVisualizationBox';
import useStore from '@/client/stores/nodeMindMapStore';

const OutputVisualizationPage = () => {
  const saveState = () => {
    const { nodes, edges } = useStore.getState(); // Access Zustand store state directly
    console.log('Saving state:', { nodes, edges });
    // Implement the save logic here, e.g., sending to a server or saving to localStorage
  };
  return (
    <div>
      <h1>Hello World</h1>
      <button
        onClick={saveState}
        className="save-button"
      >
        Save
      </button>
      <TreeVisualizationBox />
    </div>
  );
};

export default OutputVisualizationPage;
