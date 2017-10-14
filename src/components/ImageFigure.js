import React from "react"
import "./image-figure.css"

class ImageFigure extends React.Component {
	constructor(props){
		super(props);
	}
	handleClick = (e)=>{
		e.preventDefault();
		e.stopPropagation();
		
		//判断是否为中心位置
		if(this.props.position.center === true){
			this.props.inverse();  //翻转
		}else{
			this.props.center();  //放置到中心位置
		}

	}
	render() {
		let data = this.props.data;
		let position = this.props.position;

		let styleObject = {};
		styleObject.left = position.left;
		styleObject.top = position.top;

		if(position.rotate !== 0){
			styleObject["WebkitTransform"] = "rotate(" + position.rotate + "deg)";
			styleObject["transform"] = "rotate(" + position.rotate + "deg)";
		}

		if(position.center === true) styleObject.zIndex = 101;

		let className = "gallery-figure" + (position.inverse === true ? " inverse" : "");

		return (
			<figure className={className} style={styleObject} onClick={this.handleClick}>
				<img src={data.src} className="gallery-image" alt={data.name}/>
				<figcaption className="image-title">
					{data.title}
				</figcaption>
				<div className="image-description">
					{data.description}
				</div>
			</figure>
		);
	}
}

export default ImageFigure