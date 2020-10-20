class NotesController {
    constructor(url, root, inputForm) {
        this.root = root;
        this.inputForm = inputForm;
        this.url = url;

        this.inputForm.on( "submit", e => {
            e.preventDefault();
            
            const body = this.inputForm.serialize();
            this.addNewEntrie(body);
        });

        this.reloadData();
    }

    async addNewEntrie(body) {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: body
        });
        const data = await response.json();

        if (!data.success) {
            console.log(data);
        } else {
            this.addEntrie(data.uuid, data.noteText);
        }
    }

    async getNotes() {
        const response = await fetch(this.url);
        const data = await response.json();

        if (!data.success) {
            console.log(data);
        } else {
            this.entries = new Map();
            return data.data;
        }
    }

    async reloadData() {
        const data = await this.getNotes();

        for (const [key, value] of Object.entries(data)) {
            this.addEntrie(key, value);
        }

        if (this.entries.size === 0) {
            this.root.css("display", "none");
        }
    }

    addEntrie(key, value) {
        this.entries.set(key, value);

        const $row = $("<div>", {class: "row", uuid: key});
        const $noteTextDiv = $("<div>", {class: "col-8 badge badge-light text-wrap text-break"});
        
        const $editButtonDiv = $("<div>", {class: "col-1"});
        const $deleteButtonDiv = $("<div>", {class: "col-1"});

        const $editButton = $("<button>", {class: "btn btn-primary"});
        const $deleteButton = $("<button>", {class: "btn btn-danger"});

        $editButtonDiv.append($editButton);
        $deleteButtonDiv.append($deleteButton);

        $noteTextDiv.append(value);

        $editButton.append("Edit");
        $deleteButton.append("Delete");

        $row.append($noteTextDiv);
        $row.append($("<div>", {class: "col-1"}));
        $row.append($editButtonDiv);
        $row.append($deleteButtonDiv);

        $editButton.on( "click", (e) => this.editEntrie(key));
        $deleteButton.on( "click", (e) => this.deleteEntrie(key));


        this.root.append($row);

        if (this.entries.size === 1) {
            this.root.css("display", "flex");
        }
    }

    async editEntrie(uuid) {
        const noteText = prompt("Please enter text.", this.entries.get(uuid));

        if (noteText != null) {
            const response = await fetch(this.url + uuid, {
                method: 'PUT',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `noteText=${noteText}`
            });
            const data = await response.json();
    
            if (!data.success) {
                console.log(data);
            } else {
                this.root.find(".row").each(function( index ) {
                    if ($(this).attr("uuid") === uuid) {
                        const el = $(this).find("> div.col-8.badge.badge-light.text-wrap.text-break");
                        el.text(noteText);
                        return;
                    }
                });
            }
        }
    }

    async deleteEntrie(uuid) {
        const response = await fetch(this.url + uuid, {
            method: 'DELETE',
        });
        const data = await response.json();

        if (!data.success) {
            console.log(data);
        } else {
            this.root.find(".row").each(function( index ) {
                if ($(this).attr("uuid") === uuid) {
                    $(this).remove();
                    return;
                }
              });
        }
    }
}

export {NotesController};