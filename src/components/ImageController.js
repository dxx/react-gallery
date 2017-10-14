import React from "react"
import "./image-controller.css"
import inverseSrc from "../inverse.svg"

class ImageController extends React.Component {
	constructor(props){
		super(props);
	}
	handleClick = (e)=>{
		e.preventDefault();
		e.stopPropagation();

		if(this.props.position.center !== true){
			this.props.center();	
		}else{
			this.props.inverse();
		}
		
	}
	render() {
		let position = this.props.position;

		let className = "controller-unit" + (position.center === true ? " current" : "");
		if(position.inverse === true) className += " inverse";
		return (
			<div className={className} onClick={this.handleClick}>
				<span>{this.props.index}</span>
				<img src={inverseSrc} className="inverse-icon"/>
			</div>
		);
	}
}

export default ImageController