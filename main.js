import "./style.css";

import React, { ReactDOM } from "./react";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTask: "",
      tasks: [],
    };
  }

  handleInputChange = (e) => {
    this.setState({ newTask: e.target.value });
  };

  handleAddTask = () => {
    if (this.state.newTask.trim() !== "") {
      this.setState({
        tasks: [...this.state.tasks, this.state.newTask],
        newTask: "",
      });
    }
  };

  handleDeleteTask = (index) => {
    this.setState({
      tasks: this.state.tasks.filter((_, i) => i !== index),
    });
  };

  render() {
    return (
      <div>
        <h1>Todo App</h1>
        <input
          type="text"
          value={this.state.newTask}
          onChange={this.handleInputChange}
          placeholder="Add a new task"
        />
        <button onClick={this.handleAddTask}>Add Task</button>
        <ul>
          {this.state.tasks.map((task, index) => (
            <li>
              {task}
              <button onClick={() => this.handleDeleteTask(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("app"));
