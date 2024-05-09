//There are 2 versions on NPM, but only this one is maintained
import dagre from '@dagrejs/dagre';
//placeholder for initial nodes and edges types
import type { Node, Edge } from 'reactflow';

const setupDagreFlow = () => {
  const dagreFlow = new dagre.graphlib.Graph();
  dagreFlow.setDefaultEdgeLabel(() => ({}));
  dagreFlow.setGraph({ rankdir: 'TB' });
  return dagreFlow;
};

function useAutoLayout(initialNodes: Node[], initialEdges: Edge[], nodeWidth: number, nodeHeight: number) {
  const dagreGraph = setupDagreFlow();
  // Return any values or functions that you want to expose to the component using this hook
  initialNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  initialEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  initialNodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    /*
     * If you want to use the targetPosition and sourcePosition properties
     * node.targetPosition = isHorizontal ? 'left' : 'top';
     * node.sourcePosition = isHorizontal ? 'right' : 'bottom';
     */

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { initialNodes, initialEdges };
}

export default useAutoLayout;
