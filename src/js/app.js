App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../work.json', function(data) {
      var worksRow = $('#worksRow');
      var workTemplate = $('#workTemplate');
      var currentAdd = "";
      var currentAb = 0;
      var tempWorks;
      var tempdataAb = new Array(16);

      for (i = 0; i < data.length; i++) {
          tempdataAb[i] = data[i].neededAbility;
          //跳过已经完成的任务
          if(data[i].isGet && data[i].isFinished){
            continue;
          }

          workTemplate.find('.panel-title').text(data[i].name);
          workTemplate.find('img').attr('src', data[i].picture);
          workTemplate.find('.work-ab').text(data[i].neededAbility);
          //workTemplate.find('.pet-age').text(data[i].age);
          workTemplate.find('.work-ddl').text(data[i].DDL);
          workTemplate.find('.btn-get').attr('data-id', data[i].id);
          if (data[i].isGet == true) {
              workTemplate.find('.btn-get').attr("disabled",true);
          }
          else{
            workTemplate.find('.btn-get').attr("disabled",false);
          }
          if(data[i].isFinished == true){
            workTemplate.find('.btn-finish').attr("disabled",true);
          }
          else{
            workTemplate.find('.btn-finish').attr("disabled",false);
          }
          workTemplate.find('.btn-finish').attr('data-id', data[i].id);
          worksRow.append(workTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('Potting.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.potting = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract

      App.contracts.potting.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-get', App.handleAdopt);
    $(document).on('click','.btn-finish',App.handleFinish);
  },

  markAdopted: function(theWorks, account) {
    var adoptionInstance;

    App.contracts.potting.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.gettheWorks.call();
    }).then(function(theWorks) {
      tempWorks = theWorks;
      for (i = 0; i < theWorks.length; i++) {
        //alert(theWorks[i]);
        if (theWorks[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('.btn-get').text('Got').attr('disabled', true);
          //$('panel-pet').eq(i).isGet = true;
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();//不要执行与事件关联的默认动作

    var workId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      //地址
      var account;
      if(currentAdd !== "input your address"){
          account = currentAdd;
        }
      else{
        account = accounts[0];
      }
      //alert(tempdataAb[workId]);

      App.contracts.potting.deployed().then(function(instance) {
        adoptionInstance = instance;
        /*
        if(currentAb < tempdataAb[workId]){
          alert("能力值不足，无法接收该任务。");
        }
        else
          */
          return adoptionInstance.adopt(workId, { from: account });
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  markFinished: function(finishedWorks, account) {
    var finishInstance;

    App.contracts.potting.deployed().then(function(instance) {
      finishInstance = instance;

      return finishInstance.getFinishWorks.call();//
    }).then(function(finishedWorks) {
      //tempWorks = finishInstance.gettheWorks.call();
      for (i = 0; i < finishedWorks.length; i++) {
        if (finishedWorks[i]  == tempWorks[i] && finishedWorks[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('.btn-finish').text('Finished').attr('disabled', true);
          //$('panel-pet').eq(i).isGet = true;
        }
        if(finishedWorks[i] != tempWorks[i]){
          alert("只能对自己接收的任务进行完成操作。");
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },  

  handleFinish:function(event){

    event.preventDefault();//不要执行与事件关联的默认动作

    var workId = parseInt($(event.target).data('id'));

    var finishInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      //地址
      var account;
      if(currentAdd !== "input your address"){
          account = currentAdd;
        }
      else{
        account = accounts[0];
      }
      alert(account);

      App.contracts.potting.deployed().then(function(instance) {
        finishInstance = instance;

        return finishInstance.FinishWork(workId, { from: account });
      }).then(function(result) {
        return App.markFinished();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

  

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

function login(){
  //alert($('#UserAddress'.value));
  currentAdd = document.getElementById("UserAddress").value;
  currentAb = document.getElementById("UserAbility").value;
  alert("Login successfully！");
  //alert(currentAdd);
  //alert(currentAb);
  //alert(document.getElementById("UserAddress").value);
}