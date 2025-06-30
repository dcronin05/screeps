var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var sources = creep.room.find(FIND_SOURCES);

        if(creep.memory.source == 0) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            if(sources[0].energy == 0) {
                creep.memory.source = 1; // Switch to the second source if the first is empty
            }
	    }
	    if(!creep.memory.source == 0) {
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
            if(sources[1].energy == 0) {
                creep.memory.source = 0; // Switch to the first source if the second is empty
            }
        }

    }

};

module.exports = roleHarvester;