'use client'

import {
	Button,
	EntityPageHeader,
	Link,
} from '../../../../shared'
import {ProductCreateDocumentsSection} from './ui/ProductCreateDocumentsSection'
import {ProductCreateMainSection} from './ui/ProductCreateMainSection'
import {ProductCreateMediaModal} from './ui/ProductCreateMediaModal'
import {ProductCreateSpecsSection} from './ui/ProductCreateSpecsSection'
import {ProductCreateTagsSection} from './ui/ProductCreateTagsSection'
import {UploadPhotoSection} from './ui/UploadPhotoSection'
import {ProductCreateVmModelProvider, useProductCreateVm} from './viewmodel'

function ProductCreatePageContent() {
	const {page} = useProductCreateVm()

	return (
		<div className="space-y-6">
			<EntityPageHeader
				title="Создание товара"
				breadcrumbs={(
					<Link
						href="/admin/products"
						className="text-sm text-muted-foreground underline-offset-4 hover:underline"
					>
						{'Назад к списку товаров'}
					</Link>
				)}
			/>
			<div className="max-w-7xl">
				<form
					className="grid gap-6 xl:grid-cols-3"
					onSubmit={page.onSubmit}
				>
					<ProductCreateMainSection />
					<ProductCreateSpecsSection />
					<ProductCreateTagsSection />
					<UploadPhotoSection />
					<ProductCreateDocumentsSection />
					{page.createError
						? (
							<p
								className="text-sm text-destructive xl:col-span-2"
								role="alert"
							>
								{page.createError}
							</p>
						)
						: null}
					<div className="flex gap-2 xl:col-span-2">
						<Button
							type="submit"
							state={page.disabled
								? 'loading'
								: 'default'}
						>
							{'Создать'}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={page.onCancel}
						>
							{'Отмена'}
						</Button>
					</div>
				</form>
			</div>
			<ProductCreateMediaModal />
		</div>
	)
}

function ProductCreatePageClient() {
	return (
		<ProductCreateVmModelProvider>
			<ProductCreatePageContent />
		</ProductCreateVmModelProvider>
	)
}

export {ProductCreatePageClient}
