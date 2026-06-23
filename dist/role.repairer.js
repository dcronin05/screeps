var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say("🔧");
        
		if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
			creep.memory.repairing = true;
	    }
		
	    if(creep.memory.repairing) {
			var targets = creep.room.find(FIND_STRUCTURES, { 
				filter: (structure) => { 
					return (structure.hits < 500000 && structure.hits < structure.hitsMax)  ||
            		(structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
				}
			});

			if(targets.length > 0) {
				var target = creep.pos.findClosestByRange(targets);
				if(creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#7DDA58' } });
				}
			}
	    }
	    else {
            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 50
            });
            if (energy_stores.length > 0) {
                var store = creep.pos.findClosestByRange(energy_stores);
                if (store) {
                    if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(store, { visualizePathStyle: { stroke: '#FFDE59' } });
                    }
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
	}
};

module.exports = roleRepairer;