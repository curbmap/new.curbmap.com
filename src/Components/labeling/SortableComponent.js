import React, { Component } from "react";
import { render } from "react-dom";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import { connect } from "react-redux";
import labels from "./Labels";
import { changeLabels } from "../../Actions/label.action.creators";
const SortableItem = SortableElement(({ value }) => (
  <div
    style={{
      padding: 5,
      width: "80%",
      margin: 5,
      backgroundColor: labels[value].color
    }}
  >
    {value}
  </div>
));
const SelectedItem = SortableElement(({ value }) => (
  <div
    style={{
      padding: 5,
      width: "80%",
      margin: 5,
      backgroundColor: "black",
      color: "white"
    }}
  >
    {value}
  </div>
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
  onSortEnd = ({ oldIndex, newIndex }) => {
    let newLabels = arrayMove(this.props.labels, oldIndex, newIndex);
    // all props items in state?
    this.props.dispatch(changeLabels(newLabels));
  };
  selectItem(index) {
    this.props.labels.forEach((element, subindex, items) => {
      if (subindex !== index) {
        items[subindex].selected = false;
      } else {
        items[subindex].selected = true;
      }
    });
  }
  onSortStart = ({ node, index, collection }, e) => {
    this.selectItem(index);
  };
  render() {
    console.log("SORTABLE PROPS", this.props);
    return (
      <SortableList
        items={this.props.labels ? this.props.labels : []}
        onSortEnd={this.onSortEnd}
        onSortStart={this.onSortStart}
        pressDelay={150}
      />
    );
  }
}
const mapStateToProps = state => {
  console.log("SORTABLE STATE:", state);
  if (state.updateLabels.labels) {
    return {
      labels: state.updateLabels.labels
    };
  } else return;
};
const mapDispatchToProps = dispatch => {
  console.log("SORTABLE MAPDISPATCHTOPROPS", dispatch);
  return {
    dispatch
  };
};

SortableComponent = connect(mapStateToProps, mapDispatchToProps)(
  SortableComponent
);
export default SortableComponent;
