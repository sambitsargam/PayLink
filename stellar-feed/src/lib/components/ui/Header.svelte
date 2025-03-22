<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    import BookOpenText from 'lucide-svelte/icons/book-open-text';
    import Menu from 'lucide-svelte/icons/menu';
    import Signature from 'lucide-svelte/icons/signature';
    import NavbarButton from '$lib/components/ui/NavbarButton.svelte';
    import ConnectButtons from '$lib/components/ConnectButtons.svelte';

    const menuItems = [
        {
            name: 'write',
            href: '/sign',
            icon: Signature,
        },
        {
            name: 'Feed',
            href: '/read',
            icon: BookOpenText,
        },
    ];
</script>

<header class="flex-none shadow-xl z-5">
    <div class="flex flex-col bg-surface-100-800-token space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <div class="md:!hidden self-center">
                <button class="btn-icon btn-icon-sm" on:click={() => drawerStore.open()}>
                    <Menu />
                </button>
            </div>
            <div class="flex-none flex items-center">
                
            </div>
            <div class="hidden md:block flex space-x-1 md:space-x-4">
                {#each menuItems as item}
                    <NavbarButton {item} />
                {/each}
            </div>
            <div>
                <ConnectButtons />
            </div>
        </div>
    </div>
</header>
