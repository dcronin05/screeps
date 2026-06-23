var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('🔺');

        var spawns = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_SPAWN
        });
        var spawn = spawns.length > 0 ? spawns[0] : null;

        if (spawn) {
            if (creep.ticksToLive > 1499 || spawn.store.getUsedCapacity(RESOURCE_ENERGY) < 300) { 
                creep.memory.dying = false; 
            }
        }

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading && !creep.memory.dying) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#060270' } });
            }
        }
        else if (!creep.memory.dying) {
            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_LINK ||
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER
                ) && structure.store[RESOURCE_ENERGY] > 50
            });
            if (energy_stores.length > 0) {
                energy_stores.sort((a, b) => {
                    var typePriority = { link: 1, storage: 2, container: 3 };
                    return typePriority[a.structureType] - typePriority[b.structureType];
                });
                var store = energy_stores[0];
                if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(store, { visualizePathStyle: { stroke: '#FFDE59' } });
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                var source = creep.pos.findClosestByRange(sources);
                if (source) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#FFDE59' } });
                    }
                }
            }
        }
        else if (creep.memory.dying && spawn) {
            if (creep.pos.getRangeTo(spawn) > 0) {
                creep.moveTo(spawn);
            }
        }
	}
};

module.exports = roleUpgrader;