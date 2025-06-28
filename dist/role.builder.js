var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (structure) => {
	            return (structure.structureType == STRUCTURE_EXTENSION)}
			});
			// filter: {structureType: STRUCTURE_EXTENSION}});
			targets.sort((a,b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));
			// console.log(targets);
            if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
					creep.say('🏗️')
				}
			}
		}
	    else {
            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION)
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

module.exports = roleBuilder;