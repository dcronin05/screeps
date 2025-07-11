var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.say('🔺')

        if (creep.ticksToLive > 1499 || Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) < 300) { 
            creep.memory.dying = false; 
        }
        // if (creep.ticksToLive < 500 && 
        //     creep.pos.getRangeTo(Game.spawns['Spawn1']) < 10 && 
        //     Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) { 
        //         creep.memory.dying = true; 
        //         console.log(creep.name + ' is dying');
        //     }

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading && !creep.memory.dying) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#060270'}});
            }
        }
        else if (!creep.memory.dying) {

            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE)
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
        else if (creep.memory.dying) {
//            creep.say('🏥')
            if (creep.pos.getRangeTo(Game.spawns['Spawn1']) > 0) {
                creep.moveTo(Game.spawns['Spawn1']);
                console.log(creep.name + ' ' + creep.pos.getRangeTo(Game.spawns['Spawn1']) + ' away from spawn');
            }
        }
	}
};

module.exports = roleUpgrader;