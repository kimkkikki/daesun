$(document).ready(function(){
    $('#buttonUserName').click(function(){
        $.ajax({
            url:'/apis/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){
                console.log(data.list)
            }
        });
        return false;
    });


    var singleElimination = {
      "teams": [              // Matchups
        ["Team 1", "Team 2"], // First match
        ["Team 3", "Team 4"]  // Second match
      ],
      "results": [            // List of brackets (single elimination, so only one bracket)
        [                     // List of rounds in bracket
          [                   // First round in this bracket
            [1, 2],           // Team 1 vs Team 2
            [2, 3],           // Team 2 vs Team 3
            [3, 4]            // Team 3 vs Team 4
          ],
          [                   // Second (final) round in single elimination bracket
            [5, 6],           // Match for first place
            [7, 8],           // Match for first place
            [9, 10]            // Match for 3rd place
          ]
        ]
      ]
    }

    var doubleElimination = {
      "teams": [
        ["Team 1", "Team 2"],
        ["Team 3", "Team 4"]
      ],
      "results": [            // List of brackets (three since this is double elimination)
        [                     // Winner bracket
          [[1, 2], [3, 4]],   // First round and results
          [[5, 6]]            // Second round
        ],
        [                     // Loser bracket
          [[7, 8]],           // First round
          [[9, 10]]           // Second round
        ],
        [                     // Final "bracket"
          [                   // First round
            [11, 12],         // Match to determine 1st and 2nd
            [13, 14]          // Match to determine 3rd and 4th
          ],
          [                   // Second round
            [15, 16]          // LB winner won first round (11-12) so need a final decisive round
          ]
        ]
      ]
    }
    $('.demo').bracket({
      init: singleElimination
    });
});