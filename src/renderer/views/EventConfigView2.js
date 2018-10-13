import React, { Component } from 'react';
import Map from 'grommet/components/Map';
import Box from 'grommet/components/Box';

export default class MetricsView extends Component {
  render() {
    return (
<Map data={{
  "categories": [
    {
      "id": "category-1",
      "label": "First category",
      "items": [
        {
          "id": "item-1-1",
          "label": "First item",
          "node": <Box colorIndex='grey-5'  pad='small'>  First item</Box>
        },
        {
          "id": "item-1-2",
          "label": "Second item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Second item</Box>
        },
        {
          "id": "item-1-3",
          "label": "Third item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Third item</Box>
        }
      ]
    },
    {
      "id": "category-2",
      "label": "Second category",
      "items": [
        {
          "id": "item-2-1",
          "label": "Fourth item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Fourth item</Box>
        },
        {
          "id": "item-2-2",
          "label": "Fifth item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Fifth item</Box>
        }
      ]
    },
    {
      "id": "category-3",
      "label": "Third category",
      "items": [
        {
          "id": "item-3-1",
          "label": "Sixth item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Sixth item</Box>
        },
        {
          "id": "item-3-2",
          "label": "Seventh item",
          "node": <Box colorIndex='grey-5'  pad='small'>  Seventh item</Box>
        }
      ]
    }
  ],
  "links": [
  {"parentId": "item-1-1", "childId": "item-2-2", "node": <Box colorIndex='grey-5'  pad='small' onClick={console.log('hi')}>  Seventh link</Box>},
    {"parentId": "item-1-2", "childId": "item-2-2"},
    {"parentId": "item-1-2", "childId": "item-2-1"},
    {"parentId": "item-2-2", "childId": "item-3-1"},
    {"parentId": "item-2-1", "childId": "item-3-2"}
  ]
}} />
);
  }
}