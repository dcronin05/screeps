var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.ticksToLive > 1000) { 
            creep.memory.dying = false; 
        }
        if (creep.ticksToLive < 500 && Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) > 200) { 
            creep.memory.dying = true; 
            console.log(creep.name + ' is dying');
        }

	    if(!creep.memory.dying && creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.hauling = false;
	    }
	    if(!creep.memory.dying && !creep.memory.hauling && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
	        creep.memory.hauling = true;
	    }

        if(!creep.memory.dying && creep.memory.hauling) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_STORAGE
                        ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
            });

            targets.sort((a,b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));

            // for (var target of targets) {
            //     console.log(target.structureType + ' ' + target.id + ' ' + target.store.getFreeCapacity(RESOURCE_ENERGY) + ' ' + target.pos.x + 'x' + target.pos.y);
            // }

            if (targets.length > 0 && targets[0].structureType != STRUCTURE_STORAGE) {
                target = creep.pos.findClosestByRange(targets);

                for (var priority of targets) { 
                    if (priority.structureType == STRUCTURE_TOWER && priority.store.getFreeCapacity(RESOURCE_ENERGY) > 199) {
                        target = priority;
                        creep.say('🗼');
                    }
                    if (priority.structureType == STRUCTURE_SPAWN) { target = priority; }
                    if (priority.structureType == STRUCTURE_STORAGE && creep.memory.skill == 'storage') {
                        target = priority;
                        console.log('🏪');
                    }
                }

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say('🚚');
                }
            }
            else if (targets.length == 1) {
                target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say('🏪');
                    console.log('putting in storage')
                }
            }
        } 
        else if (!creep.memory.dying) {
            var energy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (e) => { return ( e.pos.x != 1 && e.pos.x != 48 && e.pos.y != 48 )}
            });
            
            energy = energy.concat(creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (
                    structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store[RESOURCE_ENERGY] > 0 &&
                    creep.moveTo(structure) != ERR_NO_PATH
                )}
            }));
            energy = energy.concat(creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => { return (tombstone.store[RESOURCE_ENERGY] > 0) &&
                    creep.moveTo(tombstone) != ERR_NO_PATH &&
                    tombstone.owner == 'GrandpaPantz'
                }
            }));
            energy = energy.concat(creep.room.find(FIND_RUINS, {
                filter: (ruin) => { return (ruin.store[RESOURCE_ENERGY] > 0) &&
                    creep.moveTo(ruin) != ERR_NO_PATH }
            }));
            
            if (energy.length > 0) {
                target = creep.pos.findClosestByRange(energy);

            // TODO: finish unreachable target logic
            

            //     for (var step of creep.pos.findPathTo(target) ) {
            //         if 
            //     }
                
                
                for (var ruin of energy) {
                    if (ruin.structure) {
                        target = ruin;
                        console.log('ruin found: ' + target.id + ' ' + target.pos.x + 'x' + target.pos.y);
                    }
                }
                // console.log('Found energy: ' + target.type + ' ' + target.pos.x + 'x' + target.pos.y);

                if (target.structureType == STRUCTURE_CONTAINER) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🫙');
                }
                else if (target.store) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🛻');
                }
                else {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🫳')
                }
            }

        }
        else {
            creep.say('🏥')
            if (creep.pos.getRangeTo(Game.spawns['Spawn1']) > 0) {
                creep.moveTo(Game.spawns['Spawn1']);
                console.log(creep.name + ' ' + creep.pos.getRangeTo(Game.spawns['Spawn1']) + ' away from spawn');
            }
        }
    }
};

module.exports = roleHauler;