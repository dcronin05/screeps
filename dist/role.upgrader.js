var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#060270'}});
                            }
        }
        else {

            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > 0)
                }
            });
            if (energy_stores.length > 0) {
                for (var store of energy_stores) {
                    if (store.store[RESOURCE_ENERGY] > 0) {
                        if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(store, {visualizePathStyle: {stroke: '#FFDE59'}});
                        }
                    }
                }
            }
        }
	}
};

module.exports = roleUpgrader;