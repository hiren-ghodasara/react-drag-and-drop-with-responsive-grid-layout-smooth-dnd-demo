import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag, generateItems } from "./utils";
import "./App.css";
// const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
// Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
// Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
const imgurl = [
  "https://i.pinimg.com/originals/6b/d2/6b/6bd26b4aac278ebdd359234c66716268.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71cF-UJaqcL._SX425_.jpg",
  "https://i.ebayimg.com/images/g/ZXYAAOSwv0tVMTWR/s-l300.jpg",
  "https://assets.change.org/photos/5/ht/ow/JGHTOwZxrIWUKoC-800x450-noPad.jpg",
  "https://i.pinimg.com/originals/88/28/ed/8828ed3fd1c7ae68c0acb0c640040562.jpg",
  "https://www.bemidjipioneer.com/sites/default/files/styles/16x9_620/public/fieldimages/2/1102/110216.n.dnt.oldgrowthforest1.jpg"
];

// const columnNames = ["", ""];

const cardColors = [
  "azure",
  "beige",
  "bisque",
  "blanchedalmond",
  "burlywood",
  "cornsilk",
  "gainsboro",
  "ghostwhite",
  "ivory",
  "khaki"
];
const pickColor = () => {
  let rand = Math.floor(Math.random() * 10);
  return cardColors[rand];
};

class Cards extends Component {
  constructor() {
    super();

    this.onColumnDrop = this.onColumnDrop.bind(this);
    this.onCardDrop = this.onCardDrop.bind(this);
    this.getCardPayload = this.getCardPayload.bind(this);
    this.state = {
      scene: {
        type: "container",
        props: {
          orientation: "horizontal"
        },
        children: generateItems(2, i => ({
          id: `column${i}`,
          type: "container",
          props: {
            orientation: "vertical",
            className: "card-container"
          },
          children: generateItems(6, j => ({
            type: "draggable",
            id: `${i}-${j}`,
            props: {
              className: "card",
              style: { backgroundColor: pickColor() }
            },
            // data: lorem.slice(0, Math.floor(Math.random() * 150) + 30)

            data: imgurl[j]
          }))
        }))
      }
    };
  }

  render() {
    return (
      <div className="card-scene">
        <nav className="navbar navbar-dark bg-dark text-center">
          <span className="navbar-brand mb-0 h1 mx-auto">
            React Drag And Drop Demo Task
          </span>
        </nav>
        <div className="row my-3 drag-main no-gutters">
          <Container
            orientation="horizontal"
            onDrop={this.onColumnDrop}
            dragHandleSelector=".column-drag-handle"
            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: "cards-drop-preview"
            }}
          >
            {this.state.scene.children.map((column, index) => {
              return (
                <div
                  className={
                    index === 0
                      ? "col-lg-6 col-xs-12 pr-2 main-wrap drag-item"
                      : "col-lg-6 col-xs-12 pr-2 main-wrap drop-item"
                  }
                >
                  <Draggable key={column.id}>
                    <div className={column.props.className}>
                      <div className="card-column-header">
                        <span className="column-drag-handle">&#x2630;</span>
                        {column.name}
                      </div>
                      <Container
                        {...column.props}
                        groupName="col"
                        onDragStart={e => console.log("drag started", e)}
                        onDragEnd={e => console.log("drag end", e)}
                        onDrop={e => this.onCardDrop(column.id, e)}
                        getChildPayload={index =>
                          this.getCardPayload(column.id, index)
                        }
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        onDragEnter={() => {
                          console.log("drag enter:", column.id);
                        }}
                        onDragLeave={() => {
                          console.log("drag leave:", column.id);
                        }}
                        onDropReady={p => console.log("Drop ready: ", p)}
                        dropPlaceholder={{
                          animationDuration: 150,
                          showOnTop: true,
                          className: "drop-preview"
                        }}
                        dropPlaceholderAnimationDuration={200}
                      >
                        {column.children.map(card => {
                          return (
                            <Draggable key={card.id}>
                              <div {...card.props}>
                                <img alt="sss" src={card.data} />
                              </div>
                            </Draggable>
                          );
                        })}
                      </Container>
                    </div>
                  </Draggable>
                </div>
              );
            })}
          </Container>
        </div>
      </div>
    );
  }

  getCardPayload(columnId, index) {
    return this.state.scene.children.filter(p => p.id === columnId)[0].children[
      index
    ];
  }

  onColumnDrop(dropResult) {
    const scene = Object.assign({}, this.state.scene);
    scene.children = applyDrag(scene.children, dropResult);
    this.setState({
      scene
    });
  }

  onCardDrop(columnId, dropResult) {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.state.scene);
      const column = scene.children.filter(p => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      this.setState({
        scene
      });
    }
  }
}

export default Cards;
