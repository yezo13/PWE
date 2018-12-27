pragma solidity ^0.4.17;

contract Potting{
	//发布任务者
	struct 	Boss{
		uint weight;//权重
		bool giveWork;//是否布置了工作
		uint numOfWork;//工作数
	}
	//接受任务者
	struct  Worker{
		uint ability;//能力值
		bool isWorking;//是否正在接收工作
		string theWork;//完成工作
		address myAd;
	}
	//任务
	struct Work{
		uint needAbility;//需要的能力值
		bool isGet;//是否被接收了
		//uint Money;//报酬
		string toDo; //任务详情
		bool isFinished;//是否被完成了
	}

	address[16] public theWorks;

	address[16] public finishedWorks;



	//声明一个用来存储任务的mapping
	mapping(string => Work) allWorks;

	//现在的任务数量
	uint currentWork;
	
	//max work number
	uint maxNumOfPots;

	//worker数量
	uint numOfWorker;
	

	//声明一个状态变量Bosses，保存每个独立地址的Boss结构体
	mapping(address => Boss) Bosses;  //以地址为索引的一个map

	//声明一个状态变量workers，保存每个独立地址的Worker结构
	mapping(address => Worker) Workers;

	//发布任务者
	address theBoss;

	//初始化任务的最大值
	function Potting(uint8 numOfPots) public{
		theBoss = msg.sender;//BOss为发送合约的人
		currentWork = 0;
		maxNumOfPots = numOfPots;
		numOfWorker = 0;
	}

	//注册成为一个worker
	function SignAsWorker(uint ab) public{
		if(msg.sender == theBoss)	return;
		Workers[msg.sender] = Worker(ab,false,"",msg.sender);
		numOfWorker++;
	}

	//检索采用者  view表示该函数不会修改合同的状态
	function gettheWorks() public view returns (address[16]) {
	  return theWorks;
	}

	function getFinishWorks() public view returns(address[16]){
		return finishedWorks;
	}


	//boss发布任务
	function giveAwork(string theWork,uint needAb) public{
		//不是boss或者任务 调用失败		
		if(msg.sender != theBoss || currentWork >= maxNumOfPots){
			return;
		}
		//新建任务
		allWorks[theWork] = Work(needAb,false,theWork,false);
		currentWork++;
	}

	//worker接受任务
	function getAwork(uint workId) public returns (uint){
		
		require(workId >= 0 && workId <= 15);//保证workId在这个范围里面

		//address currentMe = msg.sender;

		theWorks[workId] = msg.sender;
		
		//使用mapping找到那个work,判断是否能被接受
		//if(allWorks[workName].needAbility <= Workers[currentMe].ability && Workers[currentMe].isWorking == false){
		//allWorks[workName].isGet = true;
		//Workers[currentMe].isWorking = true;
		//}

		return workId;

	}

//获取任务
	function adopt(uint workId) public returns (uint) {
	  require(workId >= 0 && workId <= 15); 

	  theWorks[workId] = msg.sender;

	  return workId;
	}




	//Worker完成任务

	function FinishWork(uint workId) public returns (uint){
	  require(workId >= 0 && workId <= 15); 

	 	finishedWorks[workId] = msg.sender;

	  return workId;		
		
	}
	
	//clean the finished working
	function clearShowing() public{
	    //close the finished work in a routeing time  
	}

}