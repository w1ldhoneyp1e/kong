'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Button,
	EntityPageHeader,
	Link,
} from '../../../../shared'
import {DocumentsSection} from './ui/DocumentsSection'
import {MainSection} from './ui/MainSection'
import {SpecsSection} from './ui/SpecsSection'
import {TagsSection} from './ui/TagsSection'
import {UploadPhotoPopup} from './ui/UploadPhotoPopup'
import {UploadPhotoSection} from './ui/UploadPhotoSection'
import {
	type ProductFormMode,
	ProductCreateVmModelProvider,
	useProductCreateVm,
} from './viewmodel'

function ProductCreatePageContent() {
	const {
		page,
		main,
		specs,
		tags,
		media,
		documents,
	} = useProductCreateVm()

	return (
		<div className="space-y-6">
			<EntityPageHeader
				title={page.title}
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
					<MainSection main={main} />
					<SpecsSection specs={specs} />
					<TagsSection tags={tags} />
					<UploadPhotoSection media={media} />
					<DocumentsSection documents={documents} />
					{page.errorText
						? (
							<p
								className="text-sm text-destructive xl:col-span-2"
								role="alert"
							>
								{page.errorText}
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
							{page.submitLabel}
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
			<UploadPhotoPopup />
		</div>
	)
}

function ProductCreatePageClient({
	mode = 'create',
	productId,
	initialProduct,
}: Readonly<{
	mode?: ProductFormMode,
	productId?: string,
	initialProduct?: AdminProduct,
}>) {
	return (
		<ProductCreateVmModelProvider
			mode={mode}
			productId={productId}
			initialProduct={initialProduct}
		>
			<ProductCreatePageContent />
		</ProductCreateVmModelProvider>
	)
}

export {ProductCreatePageClient}
