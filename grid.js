/* Author: @UnrealSec */

function Grid(width, height, config, fill=' ') {
    this.grid = [];
    this.width = width;
    this.height = height;

    this.write = (x0, y0, str, borders=false)=>{
        x0=Math.round(x0);
        y0=Math.round(y0);

        if (borders) {
            var ti = this.textInfo(str);
            var x = x0-1;
            var y = y0-1;
            this.areafill(x, y, x+ti.width+1, y+ti.height+1, ' ');
            this.box(x, y, x+ti.width+1, y+ti.height+1);
        }

        var lines = str.split('\n'); var i=0;
        for (let y=y0; y<lines.length+y0; y++) {
            let line = lines[i]; var j=0;
            for (let x=x0; x<line.length+x0; x++) {
                if (this.options.autosize) {
                    if (x > -1 && y > -1) {
                        if (y>=this.height) { this.addRows(1+(y-this.height)) }
                        if (x>=this.width) { this.addColumns(1+(x-this.width)) }
                        this.grid[y][x] = line[j];
                    }
                } else {
                    if (x > -1 && y > -1 && y<this.grid.length && x<this.grid[y].length) {
                        this.grid[y][x] = line[j];
                    }
                }
                j++;
            }
            i++;
        }
    }

    this.create = (width, height, fill=' ')=>{
        this.grid = [];

        for (let y=0; y<height; y++) {
            var line = [];
            for (let x=0; x<width; x++) {
                line.push(fill);
            }
            this.grid.push(line);
        }

        this.width = width;
        this.height = height;
    }

    this.writev = (x0, y0, str, borders=false)=>{
        this.write(x0, y0, str.split('').join('\n'), borders)
    }

    this.addRows = (n, fill=' ')=>{
        var line = [];
        for (let x=0; x<this.width; x++) {
            line.push(fill);
        }
        for (let i=0; i<n; i++) {
            this.grid.push(line);
        }
        this.height = this.grid.length;
    }

    this.addColumns = (n, fill=' ')=>{
        var width = 0;
        for (let y=0; y<this.height; y++) {
            for (let i=0; i<n; i++) {
                this.grid[y].push(fill);
            }
        }
        this.width = this.grid[0].length;
    }

    this.update = (funct)=>{
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                funct(x, y);
            }
        }
    }

    this.read = (x, y)=>{
        if (x>-1 && y>-1 && y<this.height && x<this.width) {
            return this.grid[y][x];
        }
        return null;
    }

    this.line = (x0, y0, x1, y1, str='x')=>{
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
    
        while(true) {
            this.write(Math.round(x0), Math.round(y0), str);
    
            if ((x0 === x1) && (y0 === y1)) break;
            var e2 = 2*err;
            if (e2 > -dy) { err -= dy; x0  += sx; }
            if (e2 < dx) { err += dx; y0  += sy; }
       }
    }

    this.box = (x1, y1, x2, y2)=>{
        /*this.line(x1, y1, x2, y1, '-'); this.line(x1, y2, x2, y2, '-');
        this.line(x1, y1, x1, y2, '|'); this.line(x2, y1, x2, y2, '|');
        this.write(x1, y1, '+'); this.write(x2, y1, '+');
        this.write(x1, y2, '+'); this.write(x2, y2, '+');*/
        this.line(x1, y1, x2, y1, '─'); this.line(x1, y2, x2, y2, '─');
        this.line(x1, y1, x1, y2, '│'); this.line(x2, y1, x2, y2, '│');
        this.write(x1, y1, '┌'); this.write(x2, y1, '┐');
        this.write(x1, y2, '└'); this.write(x2, y2, '┘'); 
    }
    
    this.fill = (str=' ')=>{
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                this.grid[y][x] = str;
            }
        }
    }

    this.areafill = (x0, y0, x1, y1, str=' ')=>{
        for (let y=y0; y<y1; y++) {
            for (let x=x0; x<x1; x++) {
                this.write(x, y, str);
            }
        }
    }

    this.textInfo = (str)=>{
        if (str==undefined || str==null) return null;

        var lines = str.split('\n');
        var width = 0, height = lines.length;
        for (let y=0; y<height; y++) {
            if (lines[y].length > width) width = lines[y].length;
        }
        return {text: str, width: width, height: height}
    }

    this.toString = (config)=>{
        var options = {
            trim: false,
        }; if (config!=null) {
            Object.keys(config).forEach(key=>{
                options[key] = config[key];
            });
        }

        var lines = [];
        for (let y=0; y<this.grid.length; y++) {
            var line = this.grid[y].join('');
            if (options.trim) line = line.trimEnd();
            if (line.length > 0) lines.push(line);
        }
        return lines.join('\n');
    }

    this.circle = (x, y, radius, startAngle, endAngle, funct)=>{
        x = Math.round(x);
        y = Math.round(y);
        radius = Math.round(radius);
        startAngle = -(Math.PI/180)*startAngle;

        var step = 2*Math.PI/endAngle;
        var iX = x; var iY = y;

        for (var theta=startAngle; theta < 2*Math.PI+startAngle; theta+=step) {
            var x = iX + radius*Math.cos(theta);
            var y = iY - radius*Math.sin(theta);

            x = Math.round(x); y=Math.round(y);
            funct(x, y);
        }
    }

    this.options = {
        autosize: false,
    }; if (config!=null) {
        Object.keys(config).forEach(key=>{
            this.options[key] = config[key];
        });
    }

    if (width != null && height != null) {
        for (let y=0; y<height; y++) {
            var line = [];
            for (let x=0; x<width; x++) {
                line.push(fill);
            }
            this.grid.push(line);
        }
    }
} if (typeof(module)!='undefined') module.exports = Grid;
