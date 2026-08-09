window.editItem = async (id) => {
    const row = document.querySelector(`[data-item-id="${id}"]`);

    if (!row) {
        return;
    }

    const titleLabel = document.getElementById(`task-title-${id}`);
    const editButton = row.querySelector(`[data-edit-button="${id}"]`);
    const existingInput = row.querySelector(`[data-edit-input="${id}"]`);

    if (existingInput) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

        if (!csrfToken) {
            console.error('Missing CSRF token.');
            return;
        }

        try {
            const response = await fetch('/edit-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    item_id: id,
                    title: existingInput.value,
                    priority: row.dataset.priority || 'low',
                }),
            });

            const result = await response.json();

            if (result.success) {
                location.reload();
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error(error);
        }

        return;
    }

    if (!titleLabel || !editButton) {
        return;
    }

    const currentTitle = titleLabel.textContent.trim();
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.dataset.editInput = id;
    input.className = 'border border-gray-300 rounded py-1 px-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

    titleLabel.replaceWith(input);
    editButton.textContent = 'Save';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
};