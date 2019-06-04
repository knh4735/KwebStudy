var Card = React.createClass({  //카드

	openCmt : function(cardCmt, cmtsWrap, num, post){

		var card = ReactDOM.findDOMNode(this),
			cardCmt = ReactDOM.findDOMNode(cardCmt),
			cmtsWrap = ReactDOM.findDOMNode(cmtsWrap),
			marbot = 20,
			num = (num==0?1:num),
			offset = num*30 + 50;

		if(post){
			$(card).css("margin-bottom",(marbot+offset+20)+"px");
			$(cmtsWrap).css("height",offset+"px");
			var newCmt = $(cmtsWrap).find("div")[0];
			$(newCmt).css("opacity","0").animate({"opacity":"1"},500);
		}
		else {
			$(cmtsWrap).css("opacity","0");
			$(card).animate({"margin-bottom":(marbot+offset+20)+"px"},500,function(){
				$(cmtsWrap).css("height",offset+"px").animate({"opacity":"1"},200);
			});
		}
	},

	closeCmt : function(){
		var card = ReactDOM.findDOMNode(this);

		$(card).animate({"margin-bottom":"20px"},500);
	},

	render : function(){
		return (
			<div className='card'>
				<CardPck pck_code={this.props.pck.pck_code} />
				<CardInfo info={this.props.pck} />
				<div className='cardTail'>
					<CardLike like={this.props.pck.pck_like} pck_no={this.props.pck.no} />
					<CardCmt pck_no={this.props.pck.no} openCmt={this.openCmt} closeCmt={this.closeCmt} />
				</div>
			</div>
		);
	}
});

var CardPck = React.createClass({   //패키지명
	render : function(){
		return (
			<div className='cardPck'>
				{this.props.pck_code}
			</div>
		);
	}
});

var CardInfo = React.createClass({  //패키지 우클릭시 나오는 기본정보
	render : function(){
		var info = this.props.info;

		return (
				<div className='cardInfo' dangerouslySetInnerHTML={{__html: info.info}}>
				</div>
		);
	}
});

var CardLike = React.createClass({     //좋아요
	getInitialState: function() {

	    return {liked: this.props.like==0?false : true};
	},
	handleClick: function(event) {
		var self = this;

		$.ajax({
			type:'POST',
			url: './coopera.php',
			data:{'cmd' : 'like',
				'pck_no':self.props.pck_no}
		}).done(function(data){
			var liked = data['liked']=="0"?false:true;
			self.setState({liked:liked});
		});
	},
	render: function() {
		var cls;

		if(this.state.liked==true){
			cls = 'heart active';
		}
		else{
			cls = 'heart';
		}
		return (
	      <div className='cardLike' onClick={this.handleClick}>
	      	<button className={cls}></button>
	      </div>
	    );
	  }
});

var CardCmt = React.createClass({  //댓글
	getInitialState: function() {
	    return {cmts:[], closed : true};
	},

	toggleCmts : function(){
		if(this.state.closed){	//닫혀있을때 열고
			if(this.state.cmts.length==0){
				var self=this;
				$.ajax({
					type:'POST',
					url: './coopera.php',
					data:{'cmd' : 'get_cmts',
						'pck_no':self.props.pck_no}
				}).done(function(data){
					var comments = self.state.cmts;
					for(var i=0;i<data.length;i++) comments.push(data[i]);
					self.setState({cmts:comments, closed : false});
					console.log(self.state.cmts.length);
					self.props.openCmt(self, self.refs.cmtsWrap, self.state.cmts.length,false);
				});
			}
			else{
				this.setState({closed : false});
				console.log(this.state.cmts.length);
				this.props.openCmt(this, this.refs.cmtsWrap, this.state.cmts.length,false);
			}
		}
		else {	//열려있을때 닫고
			this.setState({closed : true});
			this.props.closeCmt();
		}
	},

	postCmt : function(e){
		if(e.keyCode==13){
			var self = this,
				code = this.refs.codeInput,
				info = this.refs.infoInput;

			if(code.value=='' || info.value=='') alert("입력값이 없습니다.");
			else {
				$.ajax({
				type:'POST',
				url: './coopera.php',
				data:{'cmd' : 'up_cmt',
						'pck_no':self.props.pck_no,
						'code':code.value,
						'info':info.value}
				}).done(function(data){
					console.log(data);
					var cmts = self.state.cmts,
						newCmts = [data];
					for(var i=0;i<cmts.length;i++) newCmts.push(cmts[i]);
					self.setState({cmts:newCmts, closed : false});
					self.props.openCmt(self,self.refs.cmtsWrap, self.state.cmts.length, true);
					code.value='';
					info.value='';
				});
			}
		}
	},

	render : function(){
		if(this.state.closed){
			return (
				<div className='closed'>
					<button className='cardCmt' onClick={this.toggleCmts}>댓글</button>
					<div className='cmtsWrap' ref='cmtsWrap'></div>
				</div>
			);
		}
		else {
			var cmts = this.state.cmts, result = [];
			for(var i=0; i<cmts.length;i++) result.push(<Cmt key={cmts[i].cmt_no} cmt={cmts[i]} />);
			if(cmts.length == 0) result.push(<div className='noCmt'>댓글이 없습니다.</div>);
			return (
				<div className='opened'>
					<button className='cardCmt active' onClick={this.toggleCmts}>댓글</button>
					<div className='cmtsWrap' ref='cmtsWrap'>
						{result}
						<div className='cmtInput'>
							<input type='text' ref='codeInput' placeholder='name' name='code' onKeyDown={this.postCmt} />
							<input type='text' ref='infoInput' placeholder='content' name='info' onKeyDown={this.postCmt} />
						</div>
					</div>
				</div>
			);
		}
	}
});
//콜백으로 card의 margin-bottom을 늘려야한다.
var Cmt = React.createClass({
	render : function(){
		var cmt = this.props.cmt;
		return (
			<div className='cmt'>
				<span className='cmtCode'>{cmt.cmt_code}</span>
				<span className='cmtInfo'>{cmt.cmt_info}</span>
				<br/>
			</div>
		);
	}
});					
	
var Post = React.createClass({  //게시글 쓰기

	postCard : function(){
		var self = this,
			pck = ReactDOM.findDOMNode(this.refs.pck),
			info = ReactDOM.findDOMNode(this.refs.info);

		if(pck.value == '' || info.value == '') alert("입력값이 없습니다.");
		else {
			//패키지명과 내용을 올림
			//data : 새로 올라간 글 {no, code, info}
			$.ajax({
				type:'POST',
				url: './coopera.php',
				data:{'cmd' : 'up_pck',
					'pck' : pck.value,
					'info' : info.value}
			}).done(function(data){
				pck.value='';
				info.value='';
				self.props.onPost(data);
			});
		}
	},

	render : function(){

		return (
			<div id='post'>
				<input type='text' ref='pck' id='postPck' placeholder='패키지명' />
				<textarea type='text' ref='info' id='postInfo' placeholder='내용 입력' />
				<button type='submit' name='submit' id='postSubmit' onClick={this.postCard}>게시</button>
			</div>
		);
	}
});


var Timeline = React.createClass({

	getInitialState: function(){
		return { packages : [], loadingFlag:false};
	},

	onPost: function(newPck){
		var pcks=this.state.packages,
			newpcks=[newPck],
			post = ReactDOM.findDOMNode(this.refs.post),
			cards = ReactDOM.findDOMNode(this.refs.cards);

		for(var i=0;i<pcks.length;i++) newpcks.push(pcks[i]);

		$(post).css("display","none");
		this.setState({packages: newpcks});

		$(cards).css("margin-top","50px");
		$(cards).animate({"margin-top":"320px"},1000,function(){
			$(post).css({"display":"block", "opacity":"0"}).animate({"opacity":"1"},1000);
			$(cards).css("margin-top","20px");
		});

	},

	getPackages: function(){
		var self = this;
		var cur_tot = self.state.packages.length;

		$.ajax({
			type:'POST',
			url: './coopera.php',
			data:{'cmd' : 'get_pcks', 'cur_tot' : cur_tot}
		}).done(function(data){
			var pcks=self.state.packages;
			for(var i = 0; i < data.length; i++) pcks.push(data[i]);

			self.setState({packages: pcks, loadingFlag:false});

		});
	},

	handleScroll: function(){
		var windowHeight = $(window).height();
	    var inHeight = window.innerHeight;
	    var scrollT = $(window).scrollTop();
	    var totalScrolled = scrollT+inHeight;

		if(totalScrolled == windowHeight){
			if(!this.state.loadingFlag) this.setState({loadingFlag:true});
			this.getPackages();
		}
	},

	componentDidMount: function(){
		window.addEventListener('scroll', this.handleScroll);

		this.getPackages();
	},

	render: function(){
		var self = this;
		var packages = this.state.packages;
		var result;

		if(!packages.length){
			result = <p>Loading...</p>;
		}
		else{
			result = [];
			for(var i=0; i<packages.length;i++){
				result.push(<Card key={packages[i].no} pck={packages[i]} />);
			}
		}
		
		return(
			<div>
				<Post ref='post' onPost={this.onPost} />
				<div ref='cards' className='cards'>{result}</div>
			</div>

		);
	}
});


ReactDOM.render(
	<div>
    	<Timeline />
    </div>,
    document.getElementById('main')
);