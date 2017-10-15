import React from "react"
import ReactDOM from "react-dom"
import data from "../data/picture.json"
import ImageFigure from "./ImageFigure"
import ImageController from "./ImageController"
import "./gallery.css"

let pictureDatas = [];
(function createPictures(pictureDatas){
//获取图片src
data.forEach(value => {
	value.src = require("../images/" + value.name);
	pictureDatas.push(value);
});
})(pictureDatas);

/**
 * 随机获取两个数中的随机数
 */
function randomPosition(start, end){
	return Math.floor(Math.random() * (end - start)) + start;
}
/**
 * 随机获取旋转角度
 */
function randomRotate(deg){
	let randomDeg = Math.ceil(Math.random() * deg);
	return (Math.floor(Math.random() * 2) === 0 ? "-" : "") + randomDeg;
}


class Gallery extends React.Component {
	constructor(props){
		super(props);  //调用父类构造函数，初始化this对象
		
		//定义各个位置常量
		this.position = {
			centerPosition: {  //中心点的位置
				left: 0,
				top: 0,
			},
			horizontalPosition: {  //水平方向的位置
				left: [0, 0],  //左半部分
				right: [0, 0],  //右半部分
				center: [0, 0]  //中间部分
			},
			verticalPosition: {  //垂直方向的位置
				y: [0, 0],  //左边和右边区域
				center: [0, 0]  //中间区域
			}
		}

		this.state = {
			positions: [
				/*
				{
					left: 0,
					top: 0,
					rotate: 0,
					center: false,
					inverse: false
				}
				*/
			]
		}
	}
	componentDidMount() {
		//初始化位置
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
		stageW = stageDOM.offsetWidth,
		stageH = stageDOM.offsetHeight;

		let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
		imageFigureW = imageFigureDOM.offsetWidth,
		imageFigureH = imageFigureDOM.offsetHeight;

		//计算左侧、右侧、中心点位置的取值范围
		this.position.centerPosition.left = (stageW - imageFigureW) / 2;
		this.position.centerPosition.top = (stageH - imageFigureH) / 2;

		this.position.horizontalPosition.left[0] = - imageFigureW / 2;
		this.position.horizontalPosition.left[1] = stageW / 2 - imageFigureW / 2 * 3;
		this.position.horizontalPosition.right[0] = stageW / 2 + imageFigureW;
		this.position.horizontalPosition.right[1] = stageW - imageFigureW / 2;
		this.position.verticalPosition.y[0] = - imageFigureH / 2;
		this.position.verticalPosition.y[1] = stageH - imageFigureH;

		//计算顶部区域位置的取值范围
		this.position.horizontalPosition.center[0] = stageW / 2 - imageFigureW;
		this.position.horizontalPosition.center[1] = stageW / 2;
		this.position.verticalPosition.center[0] = - imageFigureH / 2;
		this.position.verticalPosition.center[1] = stageH / 2 - imageFigureH / 2 * 3;

		//随机计算图片的位置
		this.allocationPosition(0);
	}
	allocationPosition(index) {
		let centerPosition = this.position.centerPosition,
		horizontalPosition = this.position.horizontalPosition,
		verticalPosition = this.position.verticalPosition;

		let positions = this.state.positions;

		//剔除中心图片的位置信息
		let centerImageFigures = positions.splice(index, 1);

		//设置中心图片的位置
		centerImageFigures[0] = {
			left: centerPosition.left,
			top: centerPosition.top,
			rotate: 0,
			center: true,
			inverse: false
		}

		let topIndex = 0, topSize = Math.floor(Math.random() * 2), //随机获取0或1
		topImageFigures = [];  
		if(topSize > 0){
			//随机获取已剔除中心图片后的索引
			topIndex = Math.floor(Math.random() * positions.length - 1);
			topImageFigures = positions.splice(topIndex, 1);
			//设置顶部图片的位置
			topImageFigures[0] = {
				left: randomPosition(
					horizontalPosition.center[0], 
					horizontalPosition.center[1]),
				top: randomPosition(
					verticalPosition.center[0],
					verticalPosition.center[1]),
				rotate: randomRotate(30),
				center: false,
				inverse: false
			}
		}

		//设置两边区域图片的位置
		for(let i = 0, len = positions.length, f = Math.floor(len / 2); i < len; i++){
			let p = {};
			if(i < f){
				p.left = randomPosition(
					horizontalPosition.left[0],
					horizontalPosition.left[1]
					);
			}else{
				p.left = randomPosition(
					horizontalPosition.right[0],
					horizontalPosition.right[1]
					);
			}
			p.top = randomPosition(verticalPosition.y[0], verticalPosition.y[1]);
			p.rotate = randomRotate(30);
			p.center = false;
			p.inverse = false;

			positions[i] = p;
		}

		//插入顶部区域图片位置，可能不存在
		topImageFigures.forEach(v => {
			positions.splice(topIndex, 0, v);
		});

		//插入中心图片位置，注意要后于顶部区域图片位置插入
		positions.splice(index, 0, centerImageFigures[0]);

		//修改状态，触发组件重新渲染
		this.setState({
			positions: positions
		});
	}
	/**
	 * 翻转对应索引图片
	 */
	inverse(index) {
		return function(){
			this.state.positions[index].inverse = !this.state.positions[index].inverse;

			this.setState({
				positions: this.state.positions
			});
		}.bind(this);
	}
	/**
	 * 居中对应位置的图片
	 */
	center(index) {
		return function(){
			this.allocationPosition(index);
		}.bind(this);
	}
	render() {
		let imageFigures = [], imageControllers = [];

		pictureDatas.forEach((value, index) => {

			if(!this.state.positions[index]){
				this.state.positions[index] = {
					left: 0, 
					top: 0,
					rotate: 0,
					center: false,
					inverse: false
				};
			}

			 //根据图片数据创建图片组件
			imageFigures.push(<ImageFigure 
				key = {index} data={value} 
				ref = {"imageFigure" + index}
				position = {this.state.positions[index]}
				center = {this.center(index)}
				inverse = {this.inverse(index)}
				/>);

			//创建图片控制组件
			imageControllers.push(<ImageController 
				key = {index}
				position = {this.state.positions[index]}
				index = {index + 1}
				center = {this.center(index)}
				inverse = {this.inverse(index)}
				/>);
		});

		return (
			<section className="gallery-container" ref="stage">
				<div className="gallery-box">
					{/*图片组件*/}
					{imageFigures}
				</div>
				<nav className="gallery-controller">
					{imageControllers}
				</nav>
			</section>
		);
	}
}

export default Gallery