import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import { Graph } from './graph';

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const EMPTY_TYPE = "empty"; // Empty node type
const SPECIAL_TYPE = "special";
const SPECIAL_CHILD_SUBTYPE = "specialChild";
const EMPTY_EDGE_TYPE = "emptyEdge";
const SPECIAL_EDGE_TYPE = "specialEdge";

function generateLargeSample() {
  console.log("generateLargeSample");
  const sample = {
    nodes: [],
    edges: [],
  };
  let y = 0;
  let x = 0;
  return sample;
}

class GraphLarge extends Graph {

  constructor(props) {
    super(props);
  }

}

// To bootstrap this example into the Document
export default class App extends Component  {
  render() {
    return <GraphLarge/>
  }
}