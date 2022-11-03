import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/list.css'
import { ListGroup, ListGroupItem } from 'reactstrap'


export default function List (props) {
  return (

    <ListGroup className="listg">
      <ListGroupItem className="listTitle">
        THE TOP TEN
      </ListGroupItem>
      {props.topTen == null ? null : props.topTen.map(({ name, id, count }, n) => (
        <ListGroupItem
          key={id}
        >
          {n + 1}
          {". "}
          {name}
          {" "}
          <span className="count">{count}</span>

        </ListGroupItem>
      ))}
    </ListGroup>
  )
}
