import React, { Component } from "react";
import { render } from "react-dom";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import labels from './Labels';

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
      if (this.has(elem)) {
          intersection.add(elem);
      }
  }
  return intersection;
};

const SortableItem = SortableElement(({ value }) => (
  <div style={{
    padding: 5,
    width: "80%",
    margin: 5,
    backgroundColor: labels[value].color
  }}>{value}</div>
));
const SelectedItem = SortableElement(({ value }) => (
  <div style={{
    padding: 5,
    width: "80%",
    margin: 5,
    backgroundColor: "black",
    color: "white"
  }}>{value}</div>
));

const SortableList = SortableContainer(({ items }) => {
  console.log("sortable list Container:", items);
  return (
    <div>
      {items.map((value, index) => {
        if (value.selected) {
          return (
            <SelectedItem
              key={`item-${index}`}
              index={index}
              value={value.type}
            />
          );
        } else {
          return (
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value.type}
            />
          );
        }
      })}
    </div>
  );
});

class SortableComponent extends Component {
  state = { items: this.props.items };
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    });
    // all props items in state?
    this.checkPropsInState();
    this.props.reorderedState(this.state.items);
  };
  selectItem(index) {
    let newStateItems = this.state.items;
    newStateItems.forEach((element, subindex, items) => {
      if (subindex !== index) {
        items[subindex].selected = false;
      } else {
        items[subindex].selected = true;
      }
    });
  }
  onSortStart = ({ node, index, collection }, e) => {
    console.log(index);
    console.log(this.state.items[index]);
    this.selectItem(index);
    //this.props.selectItem();
  };
  checkPropsInState() {
    let newStateItems = this.state.items;
    for (const propItem of this.props.items) {
      if (!newStateItems.includes(propItem)) {
        newStateItems.push(propItem);
      }
    }
    this.setState({ newStateItems });
  }
  render() {
    
    return (
      <SortableList
        items={this.state.items}
        onSortEnd={this.onSortEnd}
        onSortStart={this.onSortStart}
        pressDelay={200}
      />
    );
  }
}

export default SortableComponent;