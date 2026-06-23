var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.hauler');
var roleStorageHauler = require('role.storage.hauler');

module.exports.loop = function () {
    // 1. Memory Cleanup
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 2. Loop through all active rooms
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];

        // Activate safe mode if hostiles are present
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0 && room.controller && room.controller.my && !room.controller.safeMode) {
            room.controller.activateSafeMode();
        }

        // Link energy transfer (Dynamic check instead of hardcoded IDs)
        var links = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_LINK
        });
        if (links.length >= 2) {
            // Find a source link (e.g. near a source) and target link (e.g. near storage/controller)
            // For now, we dynamically transfer from the one with more energy to the one with less
            links.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
            var senderLink = links[0];
            var receiverLink = links[links.length - 1];
            if (senderLink.store.getUsedCapacity(RESOURCE_ENERGY) > 100 && receiverLink.store.getFreeCapacity(RESOURCE_ENERGY) > 100) {
                senderLink.transferEnergy(receiverLink);
            }
        }

        // Tower defense and repair logic
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        if (towers.length > 0) {
            for (var tower of towers) {
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    // Repair damaged structures up to a low threshold to save energy
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => (
                            (structure.hits < structure.hitsMax && structure.hits < 5000) ||
                            (structure.hits < 1000 && structure.structureType == STRUCTURE_CONTAINER)
                        )
                    });
                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
    }

    // 3. Creep Counting and Spawning Logic
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var storage_haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storage_hauler');

    if (Game.time % 20 == 0) {
        console.log('--- Creep Population ---');
        console.log('Harvesters: ' + harvesters.length + ' / 3');
        console.log('Haulers: ' + haulers.length + ' / 4');
        console.log('Storage Haulers: ' + storage_haulers.length + ' / 2');
        console.log('Upgraders: ' + upgraders.length + ' / 2');
        console.log('Builders: ' + builders.length + ' / 2');
        console.log('Repairers: ' + repairers.length + ' / 1');
        console.log('CPU used: ' + Game.cpu.getUsed().toFixed(2));
    }

    // Find the first available spawn dynamically
    var spawn = null;
    for (var spawnName in Game.spawns) {
        spawn = Game.spawns[spawnName];
        break;
    }

    if (spawn && !spawn.spawning) {
        var energyAvailable = spawn.room.energyAvailable;
        var energyCapacity = spawn.room.energyCapacityAvailable;

        var newName;

        // Spawning Queue
        if (haulers.length < 1) {
            newName = 'Hauler' + Game.time;
            spawn.spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, { memory: { role: 'hauler' } });
        } 
        else if (harvesters.length < 1) {
            newName = 'Harvester' + Game.time;
            spawn.spawnCreep([WORK, WORK, MOVE, MOVE], newName, { memory: { role: 'harvester' } });
        } 
        else if (harvesters.length < 3) {
            newName = 'Harvester' + Game.time;
            // Distribute harvesters to different sources dynamically
            var sources = spawn.room.find(FIND_SOURCES);
            var sourceId = sources.length > 0 ? sources[harvesters.length % sources.length].id : null;
            
            // Try to spawn larger harvester if energy capacity allows
            var body = (energyCapacity >= 550) ? [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE] : [WORK, WORK, MOVE, MOVE];
            spawn.spawnCreep(body, newName, { memory: { role: 'harvester', sourceId: sourceId } });
        } 
        else if (storage_haulers.length < 2) {
            newName = 'Storage' + Game.time;
            var body = (energyCapacity >= 600) ? [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] : [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            spawn.spawnCreep(body, newName, { memory: { role: 'storage_hauler', skill: 'storage' } });
        } 
        else if (haulers.length < 4) {
            newName = 'Hauler' + Game.time;
            var body = (energyCapacity >= 500) ? [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] : [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            spawn.spawnCreep(body, newName, { memory: { role: 'hauler' } });
        } 
        else if (repairers.length < 1) {
            newName = 'Repairer' + Game.time;
            spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'repairer' } });
        } 
        else if (upgraders.length < 2) {
            newName = 'Upgrader' + Game.time;
            var body = (energyCapacity >= 550) ? [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] : [WORK, CARRY, MOVE];
            spawn.spawnCreep(body, newName, { memory: { role: 'upgrader' } });
        } 
        else if (builders.length < 2) {
            newName = 'Builder' + Game.time;
            var body = (energyCapacity >= 550) ? [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] : [WORK, CARRY, MOVE];
            spawn.spawnCreep(body, newName, { memory: { role: 'builder' } });
        }
    }

    // Spawn visual effect
    for (var spawnName in Game.spawns) {
        var sp = Game.spawns[spawnName];
        if (sp.spawning) {
            var spawningCreep = Game.creeps[sp.spawning.name];
            if (spawningCreep) {
                sp.room.visual.text(
                    '🛠️ ' + spawningCreep.memory.role,
                    sp.pos.x + 1,
                    sp.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
            }
        }
    }

    // 4. Run creep roles and renew logic
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        // Creep renewal logic
        if (spawn && creep.pos.getRangeTo(spawn) == 1 && Object.keys(Game.creeps).length > 10) {
            spawn.renewCreep(creep);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if (creep.memory.role == 'storage_hauler') {
            roleStorageHauler.run(creep);
        }
    }
};