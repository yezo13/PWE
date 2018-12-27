pragma solidity ^0.4.17;

import "truffle/Assert.sol"; //断言检查
import "truffle/DeployedAddresses.sol"; //用于获得已部署合同的地址
import "../contracts/Adoption.sol"; //测试的智能合约

contract TestAdoption {
	  //检查地址
	 Adoption adoption = Adoption(DeployedAddresses.Adoption());

	 //用于测试的pet的id 
	 uint expectedPetId = 8;

	 //The expected owner of adopted pet is this contract
	 address expectedAdopter = this;

	//测试adoption的功能
	function testUserCanAdoptPet() public {
	  uint returnedId = adoption.adopt(expectedPetId);

	  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
	}


	//测试单个宠物主人的检索
	function testGetAdopterAddressByPetId() public {
	  address adopter = adoption.adopters(expectedPetId);

	  Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
	}

	//测试所有宠物主人的检索
	function testGetAdopterAddressByPetIdInArray() public {
	  // Store adopters in memory rather than contract's storage
	  address[16] memory adopters = adoption.getAdopters();

	  Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
	}


}