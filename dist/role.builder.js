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
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// 	, { filter: (structure) => {
	        //     return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_ROAD)}
			// });
			// filter: {structureType: STRUCTURE_EXTENSION}});
			targets.sort((b,a) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));
			// console.log(targets);
            if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
					creep.say('🏗️')
				}
			}
		}
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#FFDE59'}});
				            }
	    }
	}
};

module.exports = roleBuilder;