const express = require('express');
const app = express();

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/visitantes', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
    count: { type: Number, default: 1 },
    name: { type: String, default: "Anónimo" },
})

var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {

    if (!req.query.name) {

        Visitor.create({}, function(err) {
            if (err) return console.error(err);
            Visitor.find({}, function(err, visitor) {
                if (err) return console.error(err);
                var na = visitor;

                var $html = ('<table class="table"><thead><tr><th>Id</th><th>Name</th><th>Count</th></tr></thead>')

                for (var i = 0; i < na.length; i++) {
                    $html += '<tr>';
                    $html += '<td>' + na[i].id + '</td>';
                    $html += '<td>' + na[i].name + '</td>'
                    $html += '<td>' + na[i].count + '</td></tr>'
                }
                $html += '</table>';
                res.send($html);
            });

        });
    } else if (req.query.name) {
        Visitor.findOne({ name: req.query.name }, function(err, visitor) {

            if (err) return console.error(err);

            if (!visitor) {
                Visitor.create({ name: req.query.name }, function(err) {
                    if (err) return console.error(err);

                    Visitor.find({}, function(err, visitor) {
                        if (err) return console.error(err);
                        var na = visitor;

                        var $html = ('<table class="table"><thead><tr><th>Id</th><th>Name</th><th>Count</th></tr></thead>')

                        for (var i = 0; i < na.length; i++) {
                            $html += '<tr>';
                            $html += '<td>' + na[i].id + '</td>';
                            $html += '<td>' + na[i].name + '</td>'
                            $html += '<td>' + na[i].count + '</td></tr>'
                        }
                        $html += '</table>';

                        res.send($html);
                    });


                });
            } else {
                visitor.count += 1;
                visitor.save(function(err) {
                    if (err) return console.error(err);
                    Visitor.find({}, function(err, visitor) {
                        if (err) return console.error(err);
                        var na = visitor;

                        var $html = ('<table class="table"><thead><tr><th>Id</th><th>Name</th><th>Count</th></tr></thead>')

                        for (var i = 0; i < na.length; i++) {
                            $html += '<tr>';
                            $html += '<td>' + na[i].id + '</td>';
                            $html += '<td>' + na[i].name + '</td>'
                            $html += '<td>' + na[i].count + '</td></tr>'
                        }
                        $html += '</table>';

                        res.send($html);
                    });


                });

            }

        });
    }

});

app.listen(3000, () => console.log('Listening on port 3000!'));