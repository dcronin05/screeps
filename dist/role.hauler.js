var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('🚚');

        var spawns = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_SPAWN
        });
        var spawn = spawns.length > 0 ? spawns[0] : null;

        if (spawn) {
            if (creep.ticksToLive > 1499 || spawn.store.getUsedCapacity(RESOURCE_ENERGY) < 300) { 
                creep.memory.dying = false; 
            }
        }

        if (!creep.memory.dying && creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.hauling = false;
        }
        if (!creep.memory.dying && !creep.memory.hauling && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.hauling = true;
        }

        if (!creep.memory.dying && creep.memory.hauling) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_LAB) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            
            targets.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));

            if (targets.length > 0 && creep.memory.skill != 'storage') {
                var target = creep.pos.findClosestByRange(targets, {
                    filter: (storage) => storage.structureType != STRUCTURE_STORAGE
                });

                // Find local links acting as receivers
                var links = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_LINK && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                if (links.length > 0) {
                    target = links[0];
                }

                for (var priority of targets) { 
                    if (priority.structureType == STRUCTURE_TOWER && priority.store.getFreeCapacity(RESOURCE_ENERGY) > 399) {
                        target = priority;
                    }
                    if (priority.structureType == STRUCTURE_SPAWN) { 
                        target = priority; 
                    }
                }

                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#7DDA58' } });
                    }
                }
            } else if (targets.length > 0) {
                var target = creep.pos.findClosestByRange(targets);
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#7DDA58' } });
                    }
                }
            }
        } 
        else if (!creep.memory.dying) {
            var energy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (e) => (
                    e.pos.x != 1 &&
                    e.pos.x != 48 &&
                    e.pos.y != 48 &&
                    e.amount > 99
                )
            });
            
            energy = energy.concat(creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store[RESOURCE_ENERGY] > 100
                )
            }));
            
            energy = energy.concat(creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0
            }));
            
            energy = energy.concat(creep.room.find(FIND_RUINS, {
                filter: (ruin) => ruin.store[RESOURCE_ENERGY] > 0
            }));
            
            if (energy.length > 0) {
                var target = creep.pos.findClosestByRange(energy);

                for (var ruin of energy) {
                    if (ruin.structure) {
                        target = ruin;
                    }
                }

                if (target) {
                    if (target.structureType == STRUCTURE_CONTAINER || target.store) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#FFDE59' } });
                        }
                    } else {
                        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#FFDE59' } });
                        }
                    }
                }
            }

            if (energy.length == 0 && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.memory.skill != 'storage') {
                var energy_stores = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0
                });
                if (energy_stores.length > 0) {
                    var store = creep.pos.findClosestByRange(energy_stores);
                    if (store) {
                        if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(store, { visualizePathStyle: { stroke: '#FFDE59' } });
                        }
                    }
                }
            } else if (energy.length == 0) {
                creep.memory.hauling = true;
            }
        }
    }
};

module.exports = roleHauler;