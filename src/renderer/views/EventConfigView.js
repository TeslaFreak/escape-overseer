import React from 'react';
import VideoIcon from '@material-ui/icons/LocalMovies';
import ImageIcon from 'grommet/components/icons/base/Image';
import Layer from 'grommet/components/Layer';
import CreateNodeModal from '../components/CreateNodeModal';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkHorizontal, Polygon } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';
import { LinearGradient } from '@vx/gradient';
import { Point } from '@vx/point';

const raw = {
  "name": "Press Start",
  "type": "Trigger",
  "children": [{ 
    "name": "Play Movie",
    "type": "Event",
    "children": [
      { "name": "A1" },
      { "name": "A2" },
      { "name": "A3" },
      { "name": "C",
        "children": [{
          "name": "C1",
        }, {
          "name": "D",
          "children": [{
            "name": "D1"
          },{
            "name": "D2"
          },{
            "name": "D3"
          }]
        }]
      },
    ]},
    { "name": "Z" },
    {
    "name": "B",
    "children": [
      { "name": "B1"},
      { "name": "B2"},
      { "name": "B3"},
    ]},
  ],
};

function createModal() {
return (
  alert(`clicked: ${JSON.stringify('node.data.name')}`));
}

function Node({ node, events }) {
  const size = 70;
  return (
    <Group top={node.x ? node.x:0} left={node.y? node.y:0}>
      {node.data.type && node.data.type == 'Trigger' &&
        <Polygon sides={3} size={size/2} fill={"#F5933D"}/>
      }
      {node.data.type && node.data.type == 'Event' &&
        <rect
          height={size}
          width={size}
          y={-size / 2}
          x={-size / 2}
          fill={"#FFFFFF"}
          stroke={"#000000"}
          strokeWidth={2}
          onClick={() => {
            createModal
            //alert(`clicked: ${JSON.stringify(node.data.name)}`)
          }}
        />
      }
      <VideoIcon style={{width:50, height:'100%'}}/>
      <text
        dy={size/20 + "em"}
        fontSize={14}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function Link({ link }) {
  return (
    <svg>
    <LinkHorizontal
      data={link}
      stroke="#374469"
      strokeWidth="2"
      fill="none"
    />
    </svg>
  );
}

class eventMap extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }
  render() {
  let events = false;
  let margin = {
    top: 100,
    left: 100,
    right: 40,
    bottom: 80,
  }
  const data = hierarchy(raw);
  return (
    <svg viewBox="5 0 800 800">
      <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
      <Tree
        top={margin.top}
        left={margin.left}
        root={data}
        nodeComponent={Node}
        linkComponent={Link}
        size={[
          800 - margin.top - margin.bottom,
          800 - margin.left - margin.right
        ]}
      />
    </svg>
  );
}
}

export default eventMap;